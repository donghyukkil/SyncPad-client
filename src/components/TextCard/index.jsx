import LegalPadTextArea from "../LegalPadTextArea";

const TextCard = ({ text }) => {
  return (
    <div>
      <div>image</div>
      <div className="border p-4 flex flex-col h-full">
        <LegalPadTextArea text={text.content} />
      </div>
      ;
    </div>
  );
};

export default TextCard;
