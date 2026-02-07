import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const page = () => {
  return (
    <div className='w-87.5 mx-auto mt-50'>
      <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Your go to blog app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button>
          Login With Google
        </Button>
      </CardContent>
    </Card>
    </div>
  )
}

export default page
