import { useState } from "react";
import { useParams } from "react-router-dom";
import { ILogo } from "./assets/assets";
const Generate = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="pt-24 min-h-screen">
        <main className="max-w-6x1 mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid Ig:grid-cols-[400px_1fr] gap-8">
            {/*left panel*/}
            <div className={`space-y-6 ${id && "pointer-events-none"}`}>
              <div className="p-6 rounded-2x1 bg-white/8 border border-white/12 shadow-xl space-y-6">
                <h2>Create Your Logo</h2>
                <p>Describe your vision and let ai bring it to life</p>
              </div>
            </div>
            {/*right panel*/}
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
