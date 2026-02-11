"use client";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  
  const handleSubmit = () => {
    
    if(roomId.trim() == ""){
      alert("Abe kahi tar bhr input madhe...")
      return
    }

    router.push(`/room/${roomId}`);
    // alert(`Clicked on submit with ${roomId}`);
  }


  return ( 
    <div className={styles.page} >
      <h1>Chat App</h1>

      <input type="text" placeholder="Type your room Id here..." value={roomId} onChange={(e) => setRoomId(e.target.value)}/>

      <button onClick={handleSubmit} >Submit</button>
      {/* <Button appName="web" className={styles.secondary}>
          Submit
        </Button> */}

      {/* <h1>{roomId}</h1> */}
      
    </div>
  );
}
