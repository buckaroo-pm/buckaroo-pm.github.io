
import React from "react"
export default function Quote({children}) {
  return (
    <div style={{
      display:"flex", 
      justifyContent:"flex-start",
      fontSize: "2rem",
      paddingLeft:"2rem"
    }}>
      <div style={{
        color:"#81bedb", 
        fontSize:"7.5rem",
        fontWeight:700
      }}>
        {"\u201C"}
      </div>
      <blockquote style={{padding:0, paddingTop:"1rem", margin:0}} >
        <p style={{}}>
          {children}
        </p>
      </blockquote>
    </div>
  )
}
