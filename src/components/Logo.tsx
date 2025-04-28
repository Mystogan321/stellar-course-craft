
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <svg width="40" height="40" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M286.694 39.93C255.143 22.6557 208.943 39.93 208.943 76.5461V136.075L95.9837 83.5461C60.168 67.0742 20 93.0824 20 132.546V379.454C20 418.918 60.168 444.926 95.9837 428.454L286.694 337.07C318.245 319.796 318.245 273.204 286.694 255.929L258.943 242.546V243.622L208.943 268.075V315.075L127.984 354.404C113.954 361.133 97.7517 351.144 97.7517 335.644V176.356C97.7517 160.856 113.954 150.867 127.984 157.596L193.978 189.454C199.955 192.356 208.943 187.979 208.943 181.075V104.075L235.258 92.9196L286.694 66.9298C300.725 60.2008 300.725 47.6322 286.694 39.93Z" fill="#BD00FF"/>
        <path d="M307 151.5L307 269V344C307 359.5 324 369 338 362.5L391.5 337C406.5 329 406.5 307.5 391.5 300L363 286.5V237L391.5 221.5C406 214 406.5 194 391.5 186L338 151C324.5 143 307 150 307 165.5V151.5Z" fill="#BD00FF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M363 341.249V286.5H362V341.809L363 341.249Z" fill="#BD00FF"/>
      </svg>
      <div className="ml-2">
        <h1 className="text-2xl font-bold text-stellar-text">Stellar</h1>
        <p className="text-sm text-stellar-accent font-semibold">Learn Hub</p>
      </div>
    </div>
  );
};

export default Logo;
