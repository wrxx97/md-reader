interface AudioProps {
  src: string;
}

const Audio = ({ src }: AudioProps) => {
  return <audio src={src} controls className="reader" />;
};

export default Audio;
