import LegalPadTextArea from "../LegalPadTextArea";

const TextCard = ({ text }) => {
  return (
    <div>
      <div>image</div>
      <div className="text-white h-4/5 w-full overflow-hidden">
        <LegalPadTextArea text={text.content} />
      </div>
      ;
    </div>
  );
};

export default TextCard;
