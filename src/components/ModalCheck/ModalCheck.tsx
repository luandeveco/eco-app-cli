import React, {useEffect, useState} from 'react';
import {Styles} from './Style';
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export const ModalCheck = ({Title, Message, status, onClose}) => {
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
              <Image source={require('../../assets/img/MensageiroOK.png')} style={{width: 250, height: 200, marginVertical: '5%'}}/>
              <Text style={Styles.textColorTitle}>{Title}</Text>
              <Text style={Styles.textColorMessage}>{Message}</Text>
              <Image source={require('../../assets/icons/check.png')} style={{width: 80, height: 80, marginBottom: "4%"}}/>
              <TouchableOpacity style={Styles.button} onPress={handleClose}>
                <Text style={Styles.buttonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
