export default function generateSeed(): number {
  return Math.round(new Date().getTime() * Math.random());
}
