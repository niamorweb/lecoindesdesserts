import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { storage } from "../firebase/firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebase-config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const PostEditor = ({ isAuth }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [readTime, setReadTime] = useState(null);

  const category = "Post";

  const navigate = useNavigate();

  const postsCollectionRef = collection(db, "posts");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
    "list",
  ];

  const handleTextChange = (value) => {
    setContent(value);
  };

  const createPost = async () => {
    const slug = title
      .toLowerCase() // Convertir en minuscules
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/[^\w-]+/g, "") // Supprimer les caractères spéciaux
      .replace(/--+/g, "-") // Supprimer les tirets consécutifs
      .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début et fin de chaîne

    if (!title || !content || !postImage || !readTime || !isAuth) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    // Créer une référence à l'image dans Firebase Storage
    const storageRef = ref(storage, `images/post_image/${uuidv4()}`);

    // Télécharger l'image dans Firebase Storage
    const snapshot = await uploadBytes(storageRef, postImage);

    // Obtenir l'URL de téléchargement de l'image
    const imageURL = await getDownloadURL(snapshot.ref);

    // Ajouter le post à Firestore
    const postRef = await addDoc(postsCollectionRef, {
      category,
      title,
      content,
      slug,
      readTime,
      imageUrl: imageURL,
    });

    // Mettre à jour le post avec l'ID du document Firestore
    await updateDoc(postRef, { id: postRef.id });
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="mb-8 font-bold text-lg">POST</p>
      <div className=" flex gap-2">
        Temps de lecture approximatif en minute :
        <input
          className="border-2 border-black rounded-md w-14"
          onChange={(event) => {
            setReadTime(event.target.value);
          }}
          type="number"
        ></input>
      </div>
      <input
        onChange={(event) => {
          setPostImage(event.target.files[0]);
        }}
        type="file"
        name=""
        id=""
      />
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Titre:</span>

        <input
          className="border-2 border-gray-500  rounded-sm px-2"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Contenu:</p>
        <ReactQuill
          className="custom-editor"
          modules={modules}
          formats={formats}
          value={content}
          onChange={handleTextChange}
        />
      </div>
      <button
        onClick={createPost}
        className="bg-[#4B6BFB] text-white px-3 py-1 rounded-md"
        type="submit"
      >
        Publier
      </button>
    </div>
  );
};

export default PostEditor;
