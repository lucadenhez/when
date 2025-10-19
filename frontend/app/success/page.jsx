"use client"

import { useEffect } from "react";

export default function Success() {
    const code = new URLSearchParams(window.location.search).get("code");
    const storeTokens = async () => {
        try {
            const response = await fetch("http://localhost:8000/store_google_tokens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            
            const data = await response.json();
            console.log(data);

            localStorage.setItem('calendar_tokens', JSON.stringify(data));
            console.log("STORED TOKENS")

            window.location.href = "/availability";

        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        console.log("code:", code);

        if (code) {
            storeTokens();
        }
    });

    return (
        <div>
            Success
        </div>
    );
} 