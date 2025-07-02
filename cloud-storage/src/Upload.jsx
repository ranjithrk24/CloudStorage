import {useRef} from 'react';

export default function Upload ({handleImageUpload, setSelectedFile}) {
    const fileInputRef = useRef();

    const onSubmit = async (e) => {
        await handleImageUpload(e);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };

      
    return(
        <form onSubmit={onSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setSelectedFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload Image</button>
      </form>
    )
}