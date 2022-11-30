export const hello = (name: string): string => "Hello, " + name + "!"

export const howAboutThis = () => {
  const mycode = 'a lot'

  console.log(mycode, hello('David'))

  return mycode
}
