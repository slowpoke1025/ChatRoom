import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Index from "./components/Index";
import SetAvatar from "./components/SetAvatar";
import Test from "./pages/Test";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
