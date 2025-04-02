import { MessageCircle } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatNotifications = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      icon={
        <MessageCircle className="h-5 w-5 text-black" />
      }
      progressStyle={{
        background: "black",
      }}
      toastStyle={{ 
        background: "rgb(245, 245, 245)", 
        backdropFilter: "blur(10px)",
        border: "1px solid rgb(0, 0, 0)",
        color: "black"
      }}
    />
  );
};

export default ChatNotifications;
