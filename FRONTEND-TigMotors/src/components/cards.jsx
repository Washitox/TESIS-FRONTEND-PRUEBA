
import { Card, CardContent, CardDescription, CardTitle }  from 'keep-react'

export const CardComponent = ({title, contend}) => {
  return (
    <Card className="max-w-md">
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {content}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
