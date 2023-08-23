import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { collection } from "firebase/firestore";
import { storage } from "../firebase/firebase-config";
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { useNavigate, useParams } from "react-router-dom";

function Edit({ isAuth }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [dessertCategory, setDessertCategory] = useState(null);
  const [tempsDePreparation, setTempsDePreparation] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState(null);
  const [imgCompressed, setImgCompressed] = useState("");
  const [readTime, setReadTime] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const { editId } = useParams();
  let imageUrl;

  const navigate = useNavigate();

  useEffect(() => {
    isAuth ? null : navigate("/");
  }, []);

  useEffect(() => {
    const fetchRecipeData = async () => {
      const recipeDocRef = doc(db, "posts", editId);
      const recipeDocSnapshot = await getDoc(recipeDocRef);

      if (recipeDocSnapshot.exists()) {
        const recipeData = recipeDocSnapshot.data();
        setReadTime(recipeData.readTime);
        setTitle(recipeData.title);
        setContent(recipeData.content);
        setDessertCategory(recipeData.dessertCategory);
        setTempsDePreparation(recipeData.tempsDePreparation);
        setNumberOfPersons(recipeData.numberOfPersons);
        setOldImageUrl(recipeData.imageUrl);
      }
    };

    fetchRecipeData();
  }, [editId]);

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

  const deleteImageFromStorage = async (oldImageUrl) => {
    const imageRef = ref(storage, oldImageUrl);
    console.log("oldImageUrl = = " + oldImageUrl);
    try {
      const metadata = await getMetadata(imageRef);

      if (metadata.size > 0) {
        await deleteObject(imageRef);
        console.log("Image supprimée avec succès");
      } else {
        console.log("L'image n'existe pas dans le stockage");
      }
    } catch (error) {
      console.log(
        "Une erreur s'est produite lors de la suppression de l'image :",
        error
      );
    }
  };

  const updateRecipe = async () => {
    const recipeRef = doc(db, "posts", editId);

    const slug = title
      .trim() // Supprimer les espaces en début et en fin de chaîne
      .toLowerCase() // Convertir en minuscules
      .normalize("NFD") // Normaliser la chaîne en utilisant la forme de décomposition canonique (NFD)
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/[^\w-]+/g, "") // Supprimer les caractères spéciaux
      .replace(/--+/g, "-") // Supprimer les tirets consécutifs
      .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début et fin de chaîne

    console.log(slug);

    if (postImage) {
      // Supprimer l'ancienne image du stockage Firebase
      await deleteImageFromStorage(oldImageUrl);

      // Télécharger la nouvelle image dans le stockage Firebase
      const storageRef = ref(storage, `images/post_image/${uuidv4()}`);
      const snapshot = await uploadBytes(storageRef, postImage);
      imageUrl = await getDownloadURL(snapshot.ref);

      // Mettre à jour le document Firestore avec la nouvelle URL de l'image
      await updateDoc(recipeRef, {
        title,
        content,
        slug,
        readTime,
        dessertCategory,
        tempsDePreparation,
        numberOfPersons,
        imageUrl,
        imgCompressed,
      });
    } else {
      // Mettre à jour le document Firestore sans changer l'image
      await updateDoc(recipeRef, {
        title,
        content,
        slug,
        readTime,
        dessertCategory,
        tempsDePreparation,
        numberOfPersons,
      });
    }

    navigate("/");
  };

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

  return (
    <div className="max-w-[1200px] m-auto">
      <div className="flex flex-col gap-5">
        <p className="mb-8 font-bold text-lg">EDIT RECIPE</p>
        <div className="flex flex-col gap-2">
          <span>
            <span className="font-semibold text-red-600">
              RECETTE UNIQUEMENT :{" "}
            </span>
            Categorie du dessert
          </span>
          <select
            onChange={(event) => {
              setDessertCategory(event.target.value);
            }}
            className="border-2 border-gray-500 max-w-[300px]  rounded-sm"
            name=""
            id=""
            placeholder="Sélectionner la catégorie"
            value={dessertCategory}
          >
            <option value=""></option>
            <option value="Gâteau">Gâteau</option>
            <option value="Tarte">Tarte</option>
            <option value="Déjeuner/Goûter">Déjeuner/Goûter</option>
          </select>
        </div>
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
            value={numberOfPersons}
          />
        </div>
        <div className=" flex flex-col gap-2">
          <span>
            <span className="font-semibold text-red-600">
              RECETTE UNIQUEMENT :{" "}
            </span>
            Temps de preparation
          </span>
          <input
            className=""
            onChange={(event) => {
              setTempsDePreparation(event.target.value);
            }}
            type="time"
            value={tempsDePreparation}
          ></input>
        </div>

        <div className=" flex flex-col gap-2">
          <span>
            <span className="font-semibold text-blue-600">
              POST UNIQUEMENT :{" "}
            </span>
            Temps de lecture approximatif (en minutes ):
          </span>
          <input
            value={readTime}
            className="border-2 border-black rounded-md w-14"
            onChange={(event) => {
              setReadTime(event.target.value);
            }}
            type="number"
          ></input>
        </div>

        <div className="flex flex-col gap-2">
          <span>Photo du dessert:</span>
          <input type="file" onChange={handleImg} />
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
          <p className="font-semibold">Contenu :</p>
          <ReactQuill
            className="custom-editor"
            modules={modules}
            formats={formats}
            value={content}
            onChange={handleTextChange}
          />
        </div>
        <button
          onClick={updateRecipe}
          className="bg-[#4B6BFB] text-white px-3 py-2 rounded-md"
          type="submit"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Edit;
