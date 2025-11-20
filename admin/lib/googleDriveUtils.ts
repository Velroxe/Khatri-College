const host = process.env.NEXT_PUBLIC_BACKEND || "";

export interface UploadResult {
  fileId: string;
  publicUrl: string;
}

/**
 * Uploads a file directly to Google Drive using an access token
 * obtained from your backend.
 *
 * @param file - The file object from <input type="file" />
 * @param folderId - The Google Drive folder ID where the file should be uploaded
 * @returns {Promise<UploadResult>} The uploaded file ID and public URL
 */
export async function uploadFileToDrive(
  file: File,
  folderId: string = "1RELhHC-C-hhOEowk_sD_Em5SPwglE8cj"
): Promise<UploadResult> {
  try {
    // 1️⃣ Get short-lived access token from your backend
    const tokenResponse = await fetch(`${host}/api/google-drive/token`, {
      credentials: "include"
    });
    if (!tokenResponse.ok) throw new Error("Failed to fetch access token");

    const { access_token }: { access_token: string } = await tokenResponse.json();
    if (!access_token) throw new Error("Access token missing from response");

    // 2️⃣ Prepare file metadata (folder ID, file name)
    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    // 3️⃣ Create multipart form data (metadata + file)
    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    // 4️⃣ Upload the file directly to Google Drive
    const uploadResponse = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: form,
      }
    );

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      throw new Error(`Upload failed: ${errText}`);
    }

    const uploadData: { id: string } = await uploadResponse.json();
    const fileId = uploadData.id;

    // 5️⃣ Make the file public
    const permissionResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone",
        }),
      }
    );

    if (!permissionResponse.ok) {
      const errText = await permissionResponse.text();
      throw new Error(`Failed to make file public: ${errText}`);
    }

    // const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
    const publicUrl = `https://drive.google.com/file/d/${fileId}/view`;
    // console.log("✅ Uploaded successfully:", { fileId, publicUrl });

    return { fileId, publicUrl };
  } catch (err) {
    console.error("❌ Drive upload failed:", err);
    throw err;
  }
}

/**
 * Deletes a file from Google Drive by file ID.
 * Requires an access token from your backend.
 *
 * @param fileId - The ID of the file to delete
 */
export async function deleteFileFromDrive(fileId: string): Promise<void> {
  try {
    // 1️⃣ Get short-lived access token from backend
    const tokenResponse = await fetch(`${host}/api/google-drive/token`, {
      credentials: "include"
    });
    if (!tokenResponse.ok) throw new Error("Failed to fetch access token");

    const { access_token }: { access_token: string } = await tokenResponse.json();

    // 2️⃣ Delete the file from Google Drive
    const deleteResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!deleteResponse.ok) {
      const errText = await deleteResponse.text();
      throw new Error(`Failed to delete file: ${errText}`);
    }

    // console.log(`🗑️ File (${fileId}) deleted successfully`);
  } catch (err) {
    console.error("❌ Drive delete failed:", err);
    throw err;
  }
}