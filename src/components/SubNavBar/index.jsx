import Button from "../Button";

const SubNavBar = ({}) => {
  const userPhotoURL = localStorage.getItem("userPhotoURL");

  return (
    <div className="mr-10 bg-amber-700 h-16">
      <div className="flex justify-end my-2 mr-16 ml-96">
        <Button style={"text-sm"}>
          <img
            className="h-12 w-12 rounded-full"
            src={userPhotoURL}
            alt="userPhoto"
          />
        </Button>
      </div>
    </div>
  );
};

export default SubNavBar;
