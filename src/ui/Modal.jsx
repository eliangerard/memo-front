export const Modal = ({ children }) => {
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-black/25 z-10">
                <div className="absolute m-4 top-1/2 -translate-y-1/2 p-4 z-20 bg-white rounded-2xl border-2 shadow-lg h-fit w-full max-w-screen-sm -translate-x-[52.5%] left-1/2">
                    {children}
                </div>
            </div>
        </>
    )
}
