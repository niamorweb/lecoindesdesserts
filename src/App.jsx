import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dessert from "./pages/Dessert";
import AdminAutorized from "./pages/AdminAutorized";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase/firebase-config";
import AdminLogin from "./pages/AdminLogin";
import { useEffect, useState } from "react";
import ScrollToTop from "./scripts/ScrollToTop";
import Edit from "./components/Edit";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [postList, setPostList] = useState([]);

  const postsCollectionRef = collection(db, "posts");

  const getPosts = async () => {
    try {
      const data = await getDocs(postsCollectionRef);
      setPostList(
        data.docs.map((post) => ({
          ...post.data(),
          id: post.id,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header isAuth={isAuth} />
      <main className="mt-16  mb-36   ">
        <Routes>
          <Route path="/" element={<Home postList={postList} />} />
          <Route
            path="/desserts/:slugName"
            element={<Dessert postList={postList} isAuth={isAuth} />}
          />
          <Route
            path="/admin-login"
            element={<AdminLogin setIsAuth={setIsAuth} isAuth={isAuth} />}
          />
          <Route
            path="/admin-management"
            element={<AdminAutorized isAuth={isAuth} />}
          />
          <Route
            path="/admin-edit/:editId"
            element={<Edit isAuth={isAuth} />}
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
