import React, { useState, useEffect } from "react";
import Login from "./Login";
import Upload from "./Upload";
import Uploaded from "./Uploaded";

function App() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewIndex, setViewIndex] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`http://192.168.1.11:3000/api/images?user=${user}`)
      .then((res) => res.json())
      .then(setImages);
  }, [user, images]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user", user);
    formData.append("image", selectedFile);

    fetch("http://192.168.1.11:3000/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setImages([...images, { name: selectedFile.name, url: data.filePath }]);
        setSelectedFile(null);
      });
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div>
      <h2>Welcome, {user}</h2>
      <Upload
        handleImageUpload={handleImageUpload}
        setSelectedFile={setSelectedFile}
      />
      <Uploaded
        viewIndex={viewIndex}
        setViewIndex={setViewIndex}
        images={images}
        user={user}
        setImages={setImages}
      />

      
    </div>
  );
}

export default App;
