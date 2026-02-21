export default function Footer() {
  return (
    <footer style={{
      marginTop: "40px",
      padding: "20px",
      background: "#0f172a",
      color: "white",
      textAlign: "center",
      fontSize: "14px"
    }}>
      <p>© {new Date().getFullYear()} Ramanujan DMC</p>
      <p>
        Contact: ramanujandmc@gmail.com | WhatsApp: +91 82170 60272
      </p>
    </footer>
  );
}