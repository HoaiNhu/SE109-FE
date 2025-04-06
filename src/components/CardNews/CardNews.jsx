import Card from "react-bootstrap/Card";
import "./CardNews.css";
import LinesEllipsis from "react-lines-ellipsis";
import { CardSubtitle } from "react-bootstrap";
const CardNews = ({ img, title, detail, id, onClick }) => {
  return (
    <Card
      className="CardNews"
      style={{
        width: "27rem",
        overflow: "hidden",
        borderRadius: 15,
      }}
      onClick={() => onClick(id)}
    >
      <Card.Img
        src={img}
        style={{
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          objectFit: "cover",
          height: "20rem",
        }}
      />

      <Card.Body style={{ backgroundColor: "transparent" }}>
        <Card.Title
          style={{
            fontSize: "1.6rem",
            lineHeight: 1.5,
            textTransform: "capitalize",
            fontWeight: 600,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          {title}
        </Card.Title>
        <CardSubtitle>
          <LinesEllipsis
            text={detail}
            maxLine="2" // Số dòng tối đa
            ellipsis="..."
            trimRight
            basedOn="words"
            style={{
              fontSize: "1.2rem",
              marginLeft: 10,
              fontWeight: 400,
              color: "#fff",
            }}
          />
        </CardSubtitle>
      </Card.Body>
    </Card>
  );
};
export default CardNews;
