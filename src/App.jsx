import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Add } from "./pages/Add"
import Home from "./pages/Home"

export const App = () => {
  return (
    <BrowserRouter>
      <div className='w-full h-full flex flex-col items-center'>
        <div className='relative max-w-screen-sm w-full h-full px-4'>
          <div className='sticky top-0 py-4 bg-white/50 backdrop-blur-md'>
            <h1 className='text-4xl font-black'>Memo</h1>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
