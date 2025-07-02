const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
// Configure multer to save files with their original names and extensions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const originalName = path.basename(file.originalname, path.extname(file.originalname)); // Extract the original name without extension
        const ext = path.extname(file.originalname); // Extract the original file extension
        const uniqueSuffix = '-' + Date.now(); // Add a timestamp to ensure uniqueness
        const filename = originalName + uniqueSuffix + ext; // Combine original name, timestamp, and extension
        cb(null, filename); // Save the file with the original name and extension
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get('/', (req,res) => {
//     const files = fs.readdirSync(path.join(__dirname, 'uploads'));
//     const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="max-width: 200px; margin: 10px;" />`).join('');


//     res.send(`
//         <h2>Upload to your laptop</h2>
//         <form method = "POST" action="/save-text" onsubmit="return sendText(event)">
//         <input type = 'text' id='message' name='message placeholder = 'enter your message' required />
//         <button type="submit">Save Text</button>
//         </form>
//         <br />
//         <form method="POST" action="/upload-image" enctype="multipart/form-data">
//         <input type="file" name="image" accept="image/*" required />
//         <button type="submit">Upload Image</button>
//         </form>

       

//         <script>
//         function sendText(event) {
//             event.preventDefault();
//             const form = event.target;
//             const message = document.getElementById('message').value;
//             fetch(form.action, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 body: new URLSearchParams({ message })
//             }).then(response => response.text())
//               .then(data => alert(data))
//               .catch(error => console.error('Error:', error));
//         }
//         </script>

//         `)
// })

// app.get('/', (req, res) => {
//     // Read the uploaded files from the 'uploads' directory
//     const files = fs.readdirSync(path.join(__dirname, 'uploads'));
//     const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="max-width: 200px; margin: 10px;" />`).join('');

//     res.send(`
//         <h2>Upload to your laptop</h2>
//         <form method="POST" action="/save-text" onsubmit="return sendText(event)">
//         <input type='text' id='message' name='message' placeholder='enter your message' required />
//         <button type="submit">Save Text</button>
//         </form>
//         <br />
//         <form method="POST" action="/upload-image" enctype="multipart/form-data">
//         <input type="file" name="image" accept="image/*" required />
//         <button type="submit">Upload Image</button>
//         </form>
//         <h3>Uploaded Images:</h3>
//         ${images}
//         <script>
//         function sendText(event) {
//             event.preventDefault();
//             const form = event.target;
//             const message = document.getElementById('message').value;
//             fetch(form.action, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 body: new URLSearchParams({ message })
//             }).then(response => response.text())
//               .then(data => alert(data))
//               .catch(error => console.error('Error:', error));
//         }
//         </script>
//     `);
// });

app.get('/', (req, res) => {
    res.send(`
        <h2>Upload to your laptop</h2>
        <form method="POST" action="/save-text" onsubmit="return sendText(event)">
        <input type='text' id='message' name='message' placeholder='enter your message' required />
        <button type="submit">Save Text</button>
        </form>
        <br />
        <form method="POST" action="/upload-image" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Upload Image</button>
        </form>
        <br />
        <button onclick="window.location.href='/view'">View Uploaded Images</button>
        <script>
        function sendText(event) {
            event.preventDefault();
            const form = event.target;
            const message = document.getElementById('message').value;
            fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ message })
            }).then(response => response.text())
              .then(data => alert(data))
              .catch(error => console.error('Error:', error));
        }
        </script>
    `);
});


app.get('/view', (req, res) => {
    // Read the uploaded files from the 'uploads' directory
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    const images = files.map(file => `
        <a href="/uploads/${file}" target="_blank">
            <img src="/uploads/${file}" alt="${file}" style="max-width: 200px; margin: 10px;" />
        </a>
    `).join('');
    
    res.send(`
        <h2>Uploaded Images</h2>
        ${images}
        <br />
        <button onclick="window.location.href='/'">Go Back</button>
    `);
});


app.post("/save-text", (req, res) => {
  const data = JSON.stringify(req.body);
  fs.appendFileSync("data.txt", data + "\n");
  res.send(" Text saved to your laptop!");
});

// app.post("/upload-image", upload.single("image"), (req, res) => {
//   const file = req.file;
//   const targetPath = path.join(__dirname, "uploads", file.originalname);
//   fs.renameSync(file.path, targetPath);
//   res.send(" Image uploaded and saved to your laptop!");
// });    

app.post('/upload-image', upload.single('image'), (req, res) => {
    if (req.file) {
        res.send(`Image uploaded: ${req.file.originalname}`);
    } else {
        res.status(400).send('No image uploaded');
    }
});

app.listen(3000, () =>{
    console.log('Server running at http://localhost:3000');
});

