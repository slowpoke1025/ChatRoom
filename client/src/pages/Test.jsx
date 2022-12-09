import React, { } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { axiosFile } from '../utils/AxiosInstance';
const Test = () => {
    const fileRef = useRef();
    const [img, setImg] = useState()
    const handleUpload = async (e) => {
        e.preventDefault()
        const form = new FormData();
        const data = fileRef.current.files[0]
        form.append("file", data)
        form.append("id", "7757")
        const res = await axiosFile.post("upload/7757", form)
        setImg(res.data)
    }

    return (
        <div>
            <input type="file" ref={fileRef} onChange={(e) => {

                console.log(e.target.files[0])
                // e.target.value = "";

            }} />
            <button type="submit" onClick={handleUpload}>upload</button>
            {img && <img src={`http://localhost:5000/${img}`} alt="" />}
        </div>

    );
}

export default Test;
