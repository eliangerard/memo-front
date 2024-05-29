import { useRef, useState } from "react"

const templatePost = {
    description: "",
    file: null,
    emotions: []
}

export const Add = ({ fetchPosts }) => {

    const file = useRef(null);

    const [emotions, setEmotions] = useState([])
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(templatePost)

    const handleAddEmotion = (emotion) => {
        setEmotions(prev => {
            console.log(prev);
            if (prev.includes(emotion)) {
                return prev.filter(item => item !== emotion);
            } else {
                return [...prev, emotion];
            }
        })
    }

    const handleUpload = () => {
        if (emotions.length === 0) return;
        if (!post.file && !post.description) return;
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
                    setPost(templatePost);
                    setEmotions([]);
                    fetchPosts();
                });
        };
        reader.readAsDataURL(post.file);
    };

    return (
        <div className="rounded-2xl border-2 border-zinc-800 p-4">
            <div className="flex pb-2">
                <textarea className="rounded-lg border-0 transition-all focus:outline-0 focus:bg-zinc-600/50 p-2 outline-zinc-800 w-full resize-none bg-zinc-800 " placeholder="Descripción" name="description" id="dd"
                    onChange={(e) => setPost({ ...post, description: e.target.value })}
                    value={post.description}
                >
                </textarea>
                {post.file ?
                    <button className="bg-zinc-800 hover:bg-zinc-700/50 rounded-lg flex items-center justify-center ml-2 w-20 transition-all" onClick={() => setPost(prev => ({ ...prev, file: null }))}>
                        <svg className="h-8 stroke-zinc-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M12 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12M16 3L18.5 5.5M18.5 5.5L21 8M18.5 5.5L21 3M18.5 5.5L16 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    :
                    <button className="bg-zinc-800 hover:bg-zinc-700/50 rounded-lg flex items-center justify-center ml-2 w-20 transition-all" onClick={() => file.current.click()}>
                        <svg className="h-8 stroke-zinc-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M18.22 19.9628C17.8703 20 17.4213 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.7157 19.5903 4.40973 19.2843 4.21799 18.908C4.12583 18.7271 4.07264 18.5226 4.04193 18.2622M18.22 19.9628C18.5007 19.9329 18.7175 19.8791 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M18 9V6M18 6V3M18 6H21M18 6H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                }
            </div>
            <input ref={file} type="file" className="hidden"
                onChange={(e) => {
                    console.log("Cambiando multimedia",  e.target.files[0] );
                    setPost({ ...post, file: e.target.files[0] })
                }}
            />
            {
                post.file &&
                (post.file.type.includes('video') ?
                <button className="w-full bg-zinc-800 rounded-lg overflow-hidden h-fit">
                    <video className="w-full object-cover" src={URL.createObjectURL(post.file)} alt="Foto" loop autoPlay controls/>
                </button> :
                <button className="w-full bg-zinc-800 rounded-lg overflow-hidden h-80" onClick={() => file.current.click()}>
                    <img className="h-full w-full object-cover" src={URL.createObjectURL(post.file)} alt="Foto" />
                </button>)
            }
            <div className="overflow-x-auto w-full">
                <div className="flex pb-2">
                    <button className={`px-2 rounded-lg border-2 mr-1 hover:bg-zinc-800/50 transition-all ${emotions.includes("Happy") ? 'border-yellow-400 text-yellow-400 bg-yellow-100/25' : 'text-zinc-400 border-zinc-800'}`} onClick={() => handleAddEmotion("Happy")}>Feliz</button>
                    <button className={`px-2 rounded-lg border-2 mr-1 hover:bg-zinc-800/50 transition-all ${emotions.includes("Sad") ? 'border-blue-400 text-blue-400 bg-blue-100/25' : 'text-zinc-400 border-zinc-800'}`} onClick={() => handleAddEmotion("Sad")}>Triste</button>
                    <button className={`px-2 rounded-lg border-2 mr-1 hover:bg-zinc-800/50 transition-all ${emotions.includes("Neutral") ? 'border-gray-400 text-gray-400 bg-gray-100/25' : 'text-zinc-400 border-zinc-800'}`} onClick={() => handleAddEmotion("Neutral")}>Neutral</button>
                    <button className={`px-2 rounded-lg border-2 mr-1 hover:bg-zinc-800/50 transition-all ${emotions.includes("Angry") ? 'border-red-400 text-red-400 bg-red-100/25' : 'text-zinc-400 border-zinc-800'}`} onClick={() => handleAddEmotion("Angry")}>Enojado</button>
                    <button className={`px-2 rounded-lg border-2 mr-1 hover:bg-zinc-800/50 transition-all ${emotions.includes("Scared") ? 'border-purple-400 text-purple-400 bg-purple-100/25' : 'text-zinc-400 border-zinc-800'}`} onClick={() => handleAddEmotion("Scared")}>Asustado</button>
                    <button className={`px-2 rounded-lg border-2 mr-1 hover:bg-zinc-800/50 transition-all ${emotions.includes("Surprised") ? 'border-green-400 text-green-400 bg-green-100/25' : 'text-zinc-400 border-zinc-800'}`} onClick={() => handleAddEmotion("Surprised")}>Sorprendido</button>
                </div>
            </div>
            <button onClick={handleUpload} className="w-full bg-zinc-700 hover:bg-zinc-600/75 transition-all rounded-lg h-12" disabled={loading}>{!loading ? "Publicar" : "..."}</button>
        </div>
    )
}
