import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Webcam from "react-webcam"
import { useEffect, useState } from "react"
import { Modal } from "./ui/Modal"

let interval = null;
let timerInterval = null;

export const App = () => {

	const [posts, setPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([...posts]);
	const [next, setNext] = useState(null);
	const [loading, setLoading] = useState(false);
	const [timer, setTimer] = useState(null);

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


	const [modal, setModal] = useState(true);
	const [result, setResult] = useState("");

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

		fetch("https://byox.eliangerard.tech/api/analyze", requestOptions)
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
		<BrowserRouter>
			<div className='w-full min-h-screen h-fit flex flex-col items-center bg-zinc-900'>
				<div className='relative max-w-screen-sm w-full h-full px-4'>
					<div className='sticky top-0 py-4 bg-zinc-900/50 backdrop-blur-md flex justify-between items-center'>
						<h1 className='text-4xl font-black'>BYOX</h1>
						<div className="flex items-center">
							{timer != null && <p className='mr-2'>{timer < 10 ? '00:0' + timer : '00:'+timer}</p>}
							<button className='w-fit' onClick={() => setModal(true)}>
								<svg className="h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="12" cy="13" r="3" stroke="#FFFFFF" strokeWidth="1.5" />
									<path opacity="0.5" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z" stroke="#AAAAAA" strokeWidth="1.5" />
									<path d="M19 10H18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
								</svg>
							</button>
						</div>
					</div>
					<Modal show={modal}>
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
											setTimer(30)
											clearInterval(timerInterval)
											timerInterval = setInterval(() => {
												setTimer(prev => prev -1 < 0 ? 30 : prev - 1)
											}, 1000)
											clearTimeout(interval)
											interval = setInterval(() => {
												const imageSrc = getScreenshot()
												handleScreeshot(imageSrc)
											}, 30000)
										}}
									>
										Capture photo
									</button>
								)}
							</Webcam>
							{result && <p className='absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg'>{result}</p>}
						</div>
					</Modal>
					<Routes>
						<Route path="/" element={<Home fetchPosts={fetchPosts} filteredPosts={filteredPosts} />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	)
}
