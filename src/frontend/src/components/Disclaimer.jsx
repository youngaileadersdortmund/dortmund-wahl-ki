import React from "react";

const Disclaimer = () => {

  return (
    <div className="border-4 border-secondary my-10 p-4">
      <p className="text-primary font-bold text-xl">
        Disclaimer
      </p>
      <br></br>
      <div>
        Dieses Projekt wurde Inspiriert durch
        <a href="https://bundestagswahl.ai" className="text-primary"> bundestagswahl.ai </a>
        von 
        <a href="https://www.linkedin.com/in/tomkraftwerk/" className="text-primary"> Max Mundhenke. </a>
      </div>
      <br></br>
      <div>
        Zudem Stellt dieses Projekt allein die Sicht einer Künstlichen Inteligenz auf die möglichen Auswirkungen 
        der Umsetzung der Wahlprogramme dar. Dies ist explizit keine Wahlempfehlung.   
      </div>
    </div>
  );
};

export default Disclaimer;