import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';


const TermsOfUse = () => {
  const {t, i18n } = useTranslation();
  const nl2br = require('react-nl2br');

  const handleAccept = () => {
    window.location.href = "/Landing";
  };

  const handleDecline = () => {
    Cookies.remove("PLUSID");
    window.location.href = "/login";
  };
  
  return (
    <div className="w-3/4 overflow-y-hidden rounded flex items-center">
      <div className="" aria-labelledby="exampleModalScrollableTitle" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg ">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-900" id="exampleModalScrollableTitle">{t('termsOfUse.title')}</h5>
              </div>
              <div className="modal-body h-96 overflow-y-auto">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{t('termsOfUse.line1')}</p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{t('termsOfUse.line2')}</p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{t('termsOfUse.line3')}</p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {t('termsOfUse.title1')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title1.para1'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {t('termsOfUse.title2')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para2'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para2i'))}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para2ii'))}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para2iii'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para3'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para4'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para4i'))}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para4ii'))}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para4iii'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title2.para5'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {t('termsOfUse.title3')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title3.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title3.para2'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {t('termsOfUse.title4')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title4.para1'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {t('termsOfUse.title5')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title5.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title5.para2'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title5.para3'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">                  
                  {t('termsOfUse.title6')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title6.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title6.para2'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title6.para3'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title7')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title7.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title7.para2'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title7.para3'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title7.para4'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title7.para5'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title7.para6'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title8')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title8.para1'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title9')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title9.para1'))}  
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title10')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title10.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title10.para2'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title10.para3'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title11')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title11.para1'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title11.para2'))}
                </p>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title11.para3a'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3b'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3c'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3d'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3e'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3f'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3g'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3h'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3i'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3j'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3k'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3l'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3m'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3n'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3o'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3p'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3q'))}
                  <br />
                  {nl2br(t('termsOfUse.title11.para3r'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title12')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title12.para1'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title12.para2'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {t('termsOfUse.title13')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title13.para1'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title13.para2'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title13.para3'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title13.para4'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title13.para5'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title13.para6'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {t('termsOfUse.title14')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {nl2br(t('termsOfUse.title14.para1'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para2'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para3'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para4'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para5'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para6'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para7'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para8'))}
                  <br />
                  <br />
                  {nl2br(t('termsOfUse.title14.para9'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                   {t('termsOfUse.title15')}
                </h6>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                   {nl2br(t('termsOfUse.title15.para1'))}
                   <br/><br/>
                   {nl2br(t('termsOfUse.title15.para2'))}
                   <br/><br/>
                   {nl2br(t('termsOfUse.title15.para3'))}
                </p>
                <br />
                <h6 className="font-semibold text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {t('termsOfUse.title16')}
                </h6>
                <br />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {nl2br(t('termsOfUse.title16.para1'))}
                <br/><br/>
                {nl2br(t('termsOfUse.title16.para2'))}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 flex justify-end">
              <button
                onClick={handleAccept}
                type="button"
                className="text-white bg-ft hover:bg-ft-light rounded-md px-4 py-2 active:bg-white active:text-ft active:ring-1 active:ring-ft transition"
              >
                {t('termsOfUse.agree')}
              </button>
              <button
                onClick={handleDecline}
                type="button"
                className="text-red-500 ring-1 ring-red-500 bg-white hover:bg-red-700 hover:text-white rounded-md px-4 py-2 active:bg-white active:text-red-500 active:ring-1 active:ring-red-500 transition ml-2"
                data-dismiss="modal"
              >
                {t('termsOfUse.disagree')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
