import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { storage } from "../firebase/firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebase-config";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

function CreatePostRecipe({ isAuth }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [category, setCategory] = useState("");
  const [imgCompressed, setImgCompressed] = useState("");

  //desserts
  const [dessertCategory, setDessertCategory] = useState(null);
  const [tempsDePreparation, setTempsDePreparation] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState(null);

  //posts
  const [readTime, setReadTime] = useState(null);

  const navigate = useNavigate();

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

  const postsCollectionRef = collection(db, "posts");

  const handleTextChange = (value) => {
    setContent(value);
  };

  const handleImg = (event) => {
    handleMainImg(event);
    handleThumbnailImageUpload(event);
  };

  const handleMainImg = (event) => {
    const imageFile = event.target.files[0];

    const options = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
    };

    const compressAndSetImage = async () => {
      try {
        const compressedFile = await imageCompression(imageFile, options);
        setPostImage(compressedFile);
      } catch (error) {
        console.log(error);
      }
    };

    compressAndSetImage();
  };

  const handleThumbnailImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64 = reader.result;
        setImgCompressed(base64);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async () => {
    const slug = title
      .trim() // Supprimer les espaces en début et en fin de chaîne
      .toLowerCase() // Convertir en minuscules
      .normalize("NFD") // Normaliser la chaîne en utilisant la forme de décomposition canonique (NFD)
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/[^\w-]+/g, "") // Supprimer les caractères spéciaux
      .replace(/--+/g, "-") // Supprimer les tirets consécutifs
      .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début et fin de chaîne

    console.log("imgCompressed +  + + ", imgCompressed);
    if (
      ((!title || !content || !postImage || !imgCompressed || !isAuth) &&
        category === "recipe" &&
        (!dessertCategory || !numberOfPersons || !tempsDePreparation)) ||
      (category === "post" && !readTime)
    ) {
      alert("Veuillez remplir tous les champs et soyez connecté");
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
      dessertCategory,
      tempsDePreparation,
      numberOfPersons,
      imageUrl: imageURL,
      imgCompressed,
    });

    // Mettre à jour le post avec l'ID du document Firestore
    await updateDoc(postRef, { id: postRef.id });
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-10">
      <p className=" font-bold text-lg">RECETTE</p>
      <div className="flex flex-col gap-2">
        <div className=" flex flex-col gap-2">
          <span>
            <span className="font-semibold text-red-600">
              RECETTE UNIQUEMENT :{" "}
            </span>
            Recette pour combien de personnes ou pour combien d'unités (exemple
            : "Pour 4 personnes" ou "Pour 20 chouquettes") :
          </span>
          <input
            type="text"
            className="border-2 px-2 max-w-[300px] border-black rounded-md"
            onChange={(event) => {
              setNumberOfPersons(event.target.value);
            }}
          />
        </div>
      </div>
      <div className=" flex flex-col gap-2">
        <span>
          <span className="font-semibold text-red-600">
            RECETTE UNIQUEMENT :{" "}
          </span>
          Temps de preparation :
        </span>
        <input
          className=""
          onChange={(event) => {
            setTempsDePreparation(event.target.value);
          }}
          type="time"
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        <span>
          <span className="font-semibold text-red-600">
            RECETTE UNIQUEMENT :{" "}
          </span>
          Temps de preparation :
        </span>
        <select
          onChange={(event) => {
            setDessertCategory(event.target.value);
          }}
          className="border-2 border-gray-500 max-w-[300px]  rounded-sm"
          name=""
          id=""
          placeholder="Sélectionner la catégorie"
        >
          <option value=""></option>
          <option value="Gâteau">Gâteau</option>
          <option value="Tarte">Tarte</option>
          <option value="Déjeuner/Goûter">Déjeuner/Goûter</option>
        </select>
      </div>

      <div className=" flex flex-col gap-2">
        <span>
          <span className="font-semibold text-blue-600">
            POST UNIQUEMENT :{" "}
          </span>
          Temps de lecture approximatif (en minutes ):
        </span>
        <input
          className="border-2 border-black rounded-md w-14"
          onChange={(event) => {
            setReadTime(event.target.value);
          }}
          type="number"
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        <span>Catégorie ( recette ou post ?)</span>
        <select
          onChange={(event) => {
            setCategory(event.target.value);
          }}
          className="border-2 border-gray-500 max-w-[300px]  rounded-sm"
          name=""
          id=""
          placeholder="Sélectionner la catégorie"
        >
          <option value=""></option>
          <option value="post">Post</option>
          <option value="recipe">Recette</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <span>Image : </span>
        <input
          className=""
          onChange={(event) => handleImg(event)}
          type="file"
          name=""
          id=""
        />
      </div>
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
        <p className="font-semibold">Contenu : </p>
        <ReactQuill
          modules={modules}
          value={content}
          formats={formats}
          onChange={handleTextChange}
        />
      </div>
      <button
        onClick={createPost}
        className="bg-[#4B6BFB] text-white px-3 py-2 rounded-md"
        type="submit"
      >
        Publier
      </button>
    </div>
  );
}

export default CreatePostRecipe;
