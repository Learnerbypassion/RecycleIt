import ImageKit from "@imagekit/nodejs";

const privateKey = "private_RaBd9WErikfcnn9+ud/4TwZKRu8=";

const ImageKitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_dummy123",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || privateKey,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummyEndpoint/"
});

const uploadImage = async (file) => {
  try {
    const result = await ImageKitClient.files.upload({
      file: file.toString("base64"),
      fileName: "image_" + Date.now() + ".jpg"
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { uploadImage };