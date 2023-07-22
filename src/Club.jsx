export const Club = ({ clubName, chosenClub, setChosenClub }) => {
  return (
    <div
      className={chosenClub ? "club active" : "club"}
      onClick={() => setChosenClub(clubName)}
    >
      {clubName}
    </div>
  );
};
