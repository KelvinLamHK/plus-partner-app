import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import NWL_bilingual from "../img/NWL_bilingual.png";
import "../css/LoginFormCss.css";
import { API_BASE_URL } from "../api.config.js";
import { useTranslation } from 'react-i18next';
import TermsOfUse from "../components/TermsOfUse";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [cookies, setCookies] = useState("");
  const {t, i18n } = useTranslation();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const deviceId = await getCurrentBrowserFingerPrint();
      // const response = await fetch(`${API_BASE_URL}/authentication/login`, {
      const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: "POST",
        body: JSON.stringify({
          header: {
            send_sysname: "CLNT",
            sender: "ICBC",
            recv_sysname: "ECIF",
            receiver: "CCDC",
            msg_type: "ecif.301",
            msg_id: "20150514M3123213321421",
            send_time: "2021-09-06T12:34:56.789",
            checksum: "A1B2D3F4E5A6C7D8E9F0A1A2C3F4B5E6D7C8A9F0",
            signature: "BASE64Text",
            exts: {},
          },
          bodys: {
            body: [
              {
                username: username,
                password: password,
                otp_code: "LLL",
                login_type: "not-otp",
                deviceId: deviceId,
              },
            ],
          },
        }),
      });

      const data = await response.text();
      setCookies(data);
      if (data === "Invalid") {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Incorrect username or password",
        });
        setIsError(true);
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const deviceId = getCurrentBrowserFingerPrint();
    const checkToken = async () => {
      const token = Cookies.get("PLUSID");
      if (token) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/authentication/protected`,
            {
              method: "POST",
              body: JSON.stringify({
                authorization: "plus " + token,
                deviceId: deviceId,
              }),
            }
          );
          const data = await response.text();
          if (data !== "Invalid") {
            setIsRecord(true);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkToken();
  }, []);

  if (isRecord) {
    window.location.href = "/Landing";
    return null;
  }

  if (isSuccess) {
    Cookies.set("PLUSID", cookies, { expires: 7 });
    
    return (
      <TermsOfUse/>
    );
  }

  var lblLogin = t('loginPage.login')
  var lblLoading = t('loginPage.loading')

  return (
    <div className="shadow-md rounded h-auto p-12 max-w-lg bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <img alt="NWL_bilingual" src={NWL_bilingual} />
        <h1 className="mt-4 text-center text-title ">
          <span className="text-2xl font-semibold">{t('system.appName')}</span>
          {/*  <span className="text-2xl font-semibold">Admin</span>*/}
        </h1>
        <div className="user-box h-10 mb-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required="requried"
            className="focus:ring-transparent focus:ring-offset-transparent focus:border-ft"
          />
          <label>{t('loginPage.username')}</label>
        </div>
        <div className="user-box h-10 mb-10">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required="requried"
            className="focus:ring-transparent focus:ring-offset-transparent focus:border-ft"
          />
          <label>{t('loginPage.password')}</label>
        </div>
        <div className="mb-4 full-width flex justify-center">
          <button
            className="btn w-full p-2 bg-ft-light rounded text-white active:bg-white hover:bg-ft-light active:text-ft active:ring-1 border-0 active:ring-ft transition "
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading
                ? "lightgray"
                : isSuccess
                ? "green"
                : "",
              transition: "all 0.5s ease-in-out",
            }}
          >
            {isLoading ? lblLoading : lblLogin}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
