import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal';
import Webcam from 'react-webcam';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

function Home() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([...posts]);
    const [next, setNext] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(true);
    const [result, setResult] = useState("");

    console.log(next);
    const fetchPosts = () => {
        if (loading) return
        setLoading(true)
        fetch(`${import.meta.env.VITE_SERVER}/feeds`)
            .then((response) => response.json())
            .then((data) => {
                setLoading(false)
                setNext(data.next)
                setPosts(data.posts.reverse())
                setFilteredPosts(data.posts)
            })
    }
    useEffect(() => {
        fetchPosts()
    }, [])

    const handleScreeshot = (src) => {
        console.log(src);
        const formdata = new FormData();
        const file = dataURItoBlob(src)

        formdata.append('file', file, 'screenshot.jpeg');

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://byox.eliangerard.tech/analyze", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.result) {
                    setResult(data.result[0].dominant_emotion);
                    setFilteredPosts(posts.filter(post => post.emotion.find(emo => data.result[0].dominant_emotion.toLowerCase() == emo.toLowerCase())))
                }
            })
    }

    return (
        <>
            {modal && <Modal>
                <div className="flex justify-between mb-1">
                    <h2 className='font-semibold text-xl'>Aviso</h2>
                    <button className=''
                        onClick={() => setModal(false)}
                    >X</button>
                </div>
                <p className='mb-2'>Para usar esta red social es necesario aceptar la toma esporádica de análisis facial, con el fin de personalizar la experiencia con base a tus emociones.</p>
                <div className='overflow-hidden rounded-lg relative'>
                    <Webcam
                        audio={false}
                        height={720}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={videoConstraints}
                    >
                        {({ getScreenshot }) => (
                            <button
                                className='absolute bottom-4 right-4 bg-zinc-700 text-white px-4 py-2 rounded-lg'
                                onClick={() => {
                                    const imageSrc = getScreenshot()
                                    handleScreeshot(imageSrc)
                                }}
                            >
                                Capture photo
                            </button>
                        )}
                    </Webcam>
                    {result && <p className='absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg'>{result}</p>}
                </div>
            </Modal>}
            <div className=''>
                <button className='w-full border-2 rounded-full' onClick={() => setModal(true)}>Foto</button>
                {filteredPosts.length > 0 &&
                    filteredPosts.map((post) => {
                        const postDate = new Date(post.taken_at);
                        const currentDate = new Date();
                        const timeDiff = Math.abs(currentDate - postDate);
                        let timeAgo;

                        if (timeDiff >= 86400000) {
                            timeAgo = "Hace " + Math.floor(timeDiff / 86400000) + ' días';
                        } else if (timeDiff >= 3600000) {
                            timeAgo = "Hace " + Math.floor(timeDiff / 3600000) + ' horas';
                        } else {
                            timeAgo = "Hace " + Math.floor(timeDiff / 60000) + ' minutos';
                        }

                        return (
                            <div key={post.pk} className='my-4 rounded-2xl border-2 p-4'>
                                <div>
                                    <div className='flex justify-between items-center'>
                                        {/* <div className='flex items-center'>
                        <img
                          className='h-12 w-12 rounded-full overflow-hidden mr-4'
                          src={post.userPic}
                          alt=''
                        />
                        <div>
                          {post.user.full_name && <p className='text-xl font-medium'>{post.user.full_name}</p>}
                          {post.user.full_name ? <p className='font-bold leading-4'>@{post.user.username}</p>
                            : <p className='font-bold text-2xl h-full pb-1 flex items-center'>@{post.user.username}</p>
                          }
                        </div>
                      </div> */}

                                    </div>
                                    <p className='smd:pl-16 text-lg'>{post.caption}</p>
                                    <div className='dmd:pl-16 my-2 flex flex-col items-center'>
                                        <div className='rounded-xl overflow-hidden w-fit object-cover'>
                                            {post?.file.includes('video') ? (
                                                <video className='h-full bg-zinc-400 max-h-[600px]' src={post.file} loop autoPlay />
                                            ) : (
                                                <img className='h-full' src={post.file} alt='post' />
                                            )}
                                        </div>
                                    </div>
                                    <div className="smd:pl-16 flex justify-between">
                                        {/* <div className="flex w-32">
                                        <svg className='h-6 mr-1' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p>{post.likes.toLocaleString('es-mx')} Likes</p>
                                    </div> */}
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="flex">
                                                {
                                                    post.emotion.map((emocase, i) => {
                                                        const emotion = emocase.toLowerCase();
                                                        return (
                                                            <p key={"emotion" + Math.random() + i} className={`h-fit border-2 rounded-lg ${emotion == "happy" ? "border-yellow-400 bg-yellow-50 text-yellow-400" : emotion == "sad" ? "border-blue-400 bg-blue-50 text-blue-400" : emotion == "angry" ? "border-red-400 text-red-400 bg-red-50" : ''} px-2 mr-2`}>{emotion}</p>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <p>{timeAgo}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                <div className='h-4'></div>
                {/* <button onClick={fetchPosts}>Load more</button> */}
            </div>
        </>
    );
}

export default Home
