import { useRef, useState } from "react"

export const Add = () => {

    const file = useRef(null);

    const [emotions, setEmotions] = useState([])
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState({
        description: "",
        file: null,
        emotions: []
    })

    const handleAddEmotion = (emotion) => {
        setEmotions(prev => [...prev, emotion])
    }

    const handleUpload = () => {
        if(emotions.length === 0) return;
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64File = reader.result;
            const data = {
                caption: post.description,
                file: base64File,
                emotion: emotions
            };
            console.log(data);

            fetch(`${import.meta.env.VITE_SERVER}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((data) => {
                    setLoading(false);
                    console.log(data);
                });
        };
        reader.readAsDataURL(post.file);
    };

    return (
        <div className="rounded-2xl border-2 px-4 pt-2">
            <textarea className="rounded-lg focus:outline-2 p-2 focus:outline-zinc-200 w-full resize-none" placeholder="Descripción" name="description" id="dd"
                onChange={(e) => setPost({ ...post, description: e.target.value })}
                value={post.description}
            >

            </textarea>
            <br />
            <input ref={file} type="file" className="hidden"
                onChange={(e) => {
                    console.log("Cambiando img");
                    setPost({ ...post, file: e.target.files[0] })
                }}
            />
            <button className="w-full bg-zinc-100 rounded-lg h-80" onClick={() => file.current.click()}>Foto o Vidio</button>
            <br />
            <div className="flex py-2">
                <button className={`px-2 rounded-lg border-2 mr-1 ${emotions[0] === "Happy" ? 'border-blue-400 text-blue-400 bg-blue-100' : ''}`} onClick={() => handleAddEmotion("Happy")}>Feliz</button>
                <button className={`px-2 rounded-lg border-2 mr-1 ${emotions[1] === "Sad" ? 'border-red-400 text-red-400 bg-red-100' : ''}`} onClick={() => handleAddEmotion("Sad")}>Triste</button>
                <button className={`px-2 rounded-lg border-2 mr-1 ${emotions[2] === "Neutral" ? 'border-gray-400 text-gray-400 bg-gray-100' : ''}`} onClick={() => handleAddEmotion("Neutral")}>Neutral</button>
                <button className={`px-2 rounded-lg border-2 mr-1 ${emotions[3] === "Angry" ? 'border-yellow-400 text-yellow-400 bg-yellow-100' : ''}`} onClick={() => handleAddEmotion("Angry")}>Enojado</button>
                <button className={`px-2 rounded-lg border-2 mr-1 ${emotions[4] === "Scared" ? 'border-purple-400 text-purple-400 bg-purple-100' : ''}`} onClick={() => handleAddEmotion("Scared")}>Asustado</button>
                <button className={`px-2 rounded-lg border-2 mr-1 ${emotions[5] === "Surprised" ? 'border-green-400 text-green-400 bg-green-100' : ''}`} onClick={() => handleAddEmotion("Surprised")}>Sorprendido</button>
            </div>
            <button onClick={handleUpload} className="w-full bg-zinc-200 rounded-lg mt-2 mb-4 h-12" disabled={loading}>{!loading ? "Publicar" : "..."}</button>
        </div>
    )
}
