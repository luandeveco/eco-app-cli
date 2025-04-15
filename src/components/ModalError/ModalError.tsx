import React, {useEffect, useState} from 'react';
import {Styles} from './Style';
import {
  Image,
  Modal,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const ModalError = ({Title, Message, status, onClose}) => {
  const [visable, setVisable] = useState(false);
  useEffect(() => {
    setVisable(status);
  }, [status]);

  const handleClose = () => {
    setVisable(false);
    onClose();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visable}>
        <TouchableWithoutFeedback>
          <View style={Styles.container}>
            <View style={Styles.containerModal}>
              <Image resizeMode="contain" source={require('../../assets/img/mensageiroNOT.png')} style={{width: 250, height: 200, marginVertical: '5%'}}/>
              <Text style={Styles.textColorTitle}>{Title}</Text>
              <Text style={Styles.textColorMessage}>{Message}</Text>
              <Image source={require('../../assets/icons/error.png')} style={{width: 80, height: 80, marginBottom: "4%"}}/>
              <Pressable style={({pressed}) => [Styles.button, {opacity : pressed ? 0.6 : 1} ]} onPress={handleClose}>
                <Text style={Styles.buttonText}>Entendido</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default React.memo(ModalError)
