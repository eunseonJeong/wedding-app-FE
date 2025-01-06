import { Loader2 } from "lucide-react";

interface Props {
  type: "loading" | "error";
}
export const ScreenMessage = ({ type }: Props) => {
  console.log("type", type);
  return (
    <>
      {type === "loading" ? (
        <Loader2 className="size-20 animate-spin flex items-center justify-center h-screen m-auto" />
      ) : (
        <p>에러가 발생했습니다.</p>
      )}
    </>
  );
};
