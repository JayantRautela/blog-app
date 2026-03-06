"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const LoginPage = () => {
  const { isAuth, user, setIsAuth, setLoading, loading, setUser } = useAppData();

  const googleResponse = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${user_service}/api/v1/login`, {
        code: authResult["code"],
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      toast.success(result.data.message);
      setIsAuth(true);
      setLoading(false);
      setUser(result.data.user);
    } catch (error) {
      setLoading(false);
      console.log("error :- ", error);
      toast.error("Problem while logining in");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleResponse,
    flow: "auth-code",
  });

  if (isAuth) {
    return redirect("/");
  }

  return (
    <>
      {
        loading ? 
          <Loading /> : 
          <div className="w-87.5 mx-auto mt-50">
            <Card className="w-full max-w-sm text-center">
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Your go to blog app</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={googleLogin}>Login With Google</Button>
              </CardContent>
            </Card>
          </div>
      }
    </>
  );
};

export default LoginPage;
