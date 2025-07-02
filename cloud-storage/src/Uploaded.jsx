export default function Uploaded({viewIndex,setViewIndex,images,user,setImages}) {
    return(
        <>
        <h3>Your Uploaded Images:</h3>
      <button
        onClick={() => {
          setViewIndex(!viewIndex);
        }}
      >
        View Uploaded Images
      </button>
      {viewIndex && (
        <div>
          {images.map((img, i) => (
            <div
              key={i}
              style={{
                display: "inline-block",
                margin: "10px",
                textAlign: "center",
              }}
            >
              <a
                key={i}
                href={`http://192.168.1.11:3000${img.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`http://192.168.1.11:3000${img.url}`}
                  alt={img.name}
                  style={{
                    maxWidth: "200px",
                    cursor: "pointer",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </a>
              <a
                href={`http://192.168.1.11:3000/download/${user}/${img.name}`}
                style={{
                  display: "block",
                  marginTop: "10px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  background: "#007bff",
                  color: "#fff",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  width: "100px",
                }}
              >
                Download
              </a>
              <button
                style={{
                  color: "red",
                  marginTop: "10px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={async () => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this image?"
                  );
                  if (!confirmDelete) return;
                  await fetch(
                    `http://192.168.1.11:3000/api/images/${user}/${img.name}`,
                    { method: "DELETE" }
                  );
                  setImages(images.filter((_, idx) => idx !== i));
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      </>
    )
}