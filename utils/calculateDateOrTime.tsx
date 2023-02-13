export function calculateDateOrTime(date: Date): string {
  const dateNow = new Date().getTime();
  const postDate = new Date(date).getTime();
  const differenceInHours = Number(((dateNow - postDate) / 36e5).toFixed(0));
  let postTime = `${differenceInHours} h`;
  if (differenceInHours === 0) {
    const minutes = new Date().getMinutes() - new Date(date).getMinutes();
    postTime = `${minutes} m`;
    if (minutes === 0) {
      postTime = "Just now";
    }
  }
  if (differenceInHours > 24) {
    postTime = `${new Date(
      new Date().getTime() - differenceInHours * 60 * 60 * 1000
    ).toLocaleDateString("en-GB")}`;
  }
  return postTime;
}
