import { useEffect, useState } from 'react'
import { Add } from './Add'
function Home({ fetchPosts, filteredPosts = [] }) {  

    return (
        <>
            
            <div className=''>
                <Add fetchPosts={fetchPosts}/>
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
                            <div key={post.pk} className='my-4 rounded-2xl border-2 border-zinc-800 p-4'>
                                <div>
                                    <div className='flex justify-between items-center'>

                                    </div>
                                    <p className='smd:pl-16 text-lg text-zinc-300 pb-2'>{post.caption}</p>
                                    <div className='dmd:pl-16 mb-2 flex flex-col items-center'>
                                        <div className='rounded-lg overflow-hidden w-fit object-cover'>
                                            {post?.file.includes('video') ? (
                                                <video className='h-full bg-zinc-400 max-h-[600px]' src={post.file} loop autoPlay controls/>
                                            ) : (
                                                <img className='h-full' src={post.file} alt='post' />
                                            )}
                                        </div>
                                    </div>
                                    <div className="smd:pl-16 flex justify-between">
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="flex">
                                                {
                                                    post.emotion.map((emocase, i) => {
                                                        const emotion = emocase.toLowerCase();
                                                        return (
                                                            <p key={"emotion" + Math.random() + i} className={`h-fit border-2 rounded-lg ${emotion == "happy" ? "border-yellow-400 bg-yellow-50/25 text-yellow-400" : emotion == "sad" ? "border-blue-400 bg-blue-50/25 text-blue-400" : emotion == "angry" ? "border-red-400 text-red-400 bg-red-50/25" : 'border-zinc-800 '} px-2 mr-2`}>{emotion}</p>
                                                        )
                                                    })
                                                }
                                            </div>
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
