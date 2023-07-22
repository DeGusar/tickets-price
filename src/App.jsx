import { useState, useEffect } from "react";
import { Col, Row, Button, Divider, Input, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./App.scss";
import { Club } from "./Club";

function App() {
  const [newClubName, setNewClubName] = useState();
  const [clubsList, setClubsList] = useState(
    () => JSON.parse(localStorage.getItem("clubs")) ?? []
  );

  const [priceOtn, setPriceOtn] = useState(
    () => JSON.parse(localStorage.getItem(`price-otn-${clubsList[0]}`)) ?? ""
  );

  const [priceOtm, setPriceOtm] = useState(
    () => JSON.parse(localStorage.getItem(`price-otm-${clubsList[0]}`)) ?? ""
  );

  const [priceKt, setPriceKt] = useState(
    () => JSON.parse(localStorage.getItem(`price-kt-${clubsList[0]}`)) ?? ""
  );

  const [priceNp, setPriceNp] = useState(
    () => JSON.parse(localStorage.getItem(`price-np-${clubsList[0]}`)) ?? ""
  );

  const [myKd, setMyKd] = useState(
    () => JSON.parse(localStorage.getItem(`my-kd-${clubsList[0]}`)) ?? ""
  );

  const [chosenClub, setChosenClub] = useState(clubsList[0] ?? "");
  const [enemyKd, setEnemyKd] = useState("");

  useEffect(() => {
    localStorage.setItem("clubs", JSON.stringify(clubsList));
  }, [clubsList]);

  useEffect(() => {
    setPriceOtn(localStorage.getItem(`price-otn-${chosenClub}`) ?? "");
    setPriceOtm(localStorage.getItem(`price-otm-${chosenClub}`) ?? "");
    setPriceKt(localStorage.getItem(`price-kt-${chosenClub}`) ?? "");
    setPriceNp(localStorage.getItem(`price-np-${chosenClub}`) ?? "");
    setMyKd(localStorage.getItem(`my-kd-${chosenClub}`) ?? "");
    setEnemyKd("");
  }, [chosenClub]);

  const handleAddClub = () => {
    if (!newClubName) {
      return;
    }
    setClubsList((prev) => prev.concat(newClubName));
    setChosenClub(newClubName);

    setNewClubName("");
  };

  const handleDeleteClub = (clubName) => {
    setClubsList((prev) => prev.filter((club) => club !== clubName));
    setChosenClub("");
    localStorage.removeItem(`price-kt-${clubName}`);
    localStorage.removeItem(`price-otn-${clubName}`);
    localStorage.removeItem(`price-otm-${clubName}`);
    localStorage.removeItem(`price-np-${clubName}`);
    localStorage.removeItem(`my-kd-${clubName}`);
  };

  const savePrices = () => {
    localStorage.setItem(`price-kt-${chosenClub}`, priceKt);
    localStorage.setItem(`price-otn-${chosenClub}`, priceOtn);
    localStorage.setItem(`price-otm-${chosenClub}`, priceOtm);
    localStorage.setItem(`price-np-${chosenClub}`, priceNp);
  };

  const calculatePrice = (recommendPrice) => {
    if (!enemyKd || !myKd) return "-";
    if (enemyKd < myKd) {
      return Math.round(
        (recommendPrice / 2 / myKd) * enemyKd + recommendPrice / 2
      );
    }
    return (
      Math.round(((recommendPrice / 2 / myKd) * (enemyKd - myKd)) / 2) +
      +recommendPrice
    );
  };

  //(((рекомендованная цена/2)/текущее значение КД*(КД соперника-КД вашей команды))/2)+рекомендованная цена

  return (
    <Row>
      <Col xs={{ span: 24 }} lg={{ span: 18, offset: 3 }}>
        <div className="main-container">
          <Space.Compact className="add-club">
            <Input
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              onPressEnter={handleAddClub}
              placeholder="Добавить клуб"
            />
            <Button
              onClick={handleAddClub}
              type="primary"
              size="large"
              icon={<PlusOutlined />}
            />
          </Space.Compact>
        </div>
        <Divider />
        {clubsList.length ? (
          <>
            <div className="clubs-list">
              {clubsList.map((club) => (
                <Club
                  clubName={club}
                  chosenClub={club === chosenClub}
                  setChosenClub={setChosenClub}
                  key={club}
                />
              ))}
            </div>
            <Divider />
          </>
        ) : null}

        {chosenClub ? (
          <>
            <div className="club-details">
              <div className="club-title">
                <Typography.Text underline>{chosenClub}</Typography.Text>
                <Button
                  type="default"
                  onClick={() => handleDeleteClub(chosenClub)}
                >
                  Удалить
                </Button>
              </div>
              <Row gutter={8} className="inputs-wrapper">
                <div className="prices-title">
                  <Typography.Text>Рекомендованные цены</Typography.Text>
                </div>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">КТ</Typography.Text>
                  <Input
                    value={priceKt}
                    onChange={(e) => setPriceKt(e.target.value)}
                  />
                </Col>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">ОТН</Typography.Text>
                  <Input
                    value={priceOtn}
                    onChange={(e) => setPriceOtn(e.target.value)}
                  />
                </Col>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">ОТМ</Typography.Text>
                  <Input
                    value={priceOtm}
                    onChange={(e) => setPriceOtm(e.target.value)}
                  />
                </Col>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">НП</Typography.Text>
                  <Input
                    value={priceNp}
                    onChange={(e) => setPriceNp(e.target.value)}
                  />
                </Col>
                <Col span={8} className="save-btn-wrapper">
                  <Button type="primary" onClick={savePrices}>
                    Сохранить
                  </Button>
                </Col>
              </Row>
              <Row gutter={8} className="inputs-wrapper">
                <div className="prices-title">
                  <Typography.Text>Цена билета на матч</Typography.Text>
                </div>
                <Col span={6} className="input-wrapper">
                  <Typography.Text type="secondary">КД МОЙ</Typography.Text>
                  <Input
                    value={myKd}
                    onChange={(e) => {
                      setMyKd(e.target.value);
                      localStorage.setItem(
                        `my-kd-${chosenClub}`,
                        e.target.value
                      );
                    }}
                  />
                </Col>
                <Col span={6} className="input-wrapper">
                  <Typography.Text type="secondary">КД СОП</Typography.Text>
                  <Input
                    value={enemyKd}
                    onChange={(e) => setEnemyKd(e.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={8} className="inputs-wrapper">
                <div className="prices-title">
                  <Typography.Text>Посчитанные цены</Typography.Text>
                </div>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">КТ</Typography.Text>
                  <Typography.Paragraph
                    copyable={enemyKd && myKd && calculatePrice(priceKt)}
                  >
                    {calculatePrice(priceKt)}
                  </Typography.Paragraph>
                </Col>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">ОТН</Typography.Text>
                  <Typography.Paragraph>
                    {calculatePrice(priceOtn)}
                  </Typography.Paragraph>
                </Col>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">ОТМ</Typography.Text>
                  <Typography.Paragraph>
                    {calculatePrice(priceOtm)}
                  </Typography.Paragraph>
                </Col>
                <Col span={4} className="input-wrapper">
                  <Typography.Text type="secondary">НП</Typography.Text>
                  <Typography.Paragraph
                    copyable={enemyKd && myKd && calculatePrice(priceNp)}
                  >
                    {calculatePrice(priceNp)}
                  </Typography.Paragraph>
                </Col>
              </Row>
            </div>
          </>
        ) : null}
      </Col>
    </Row>
  );
}

export default App;
