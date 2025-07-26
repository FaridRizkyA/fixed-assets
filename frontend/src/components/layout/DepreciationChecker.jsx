import { useEffect } from "react";
import axios from "axios";

function DepreciationChecker() {
  useEffect(() => {
    const checkDepreciation = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/depreciations/check-and-update");
        if (res.data?.updated > 0) {
          console.log(`🧮 Penyusutan otomatis: ${res.data.updated} aset diperbarui.`);
        }
      } catch (err) {
        console.error("❌ Gagal memeriksa penyusutan:", err);
      }
    };

    checkDepreciation();
  }, []);

  return null; // tidak menampilkan UI apa pun
}

export default DepreciationChecker;