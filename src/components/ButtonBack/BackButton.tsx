import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Styles} from './Style';

const BackButton = ({onPress}) => {
  return (
    <TouchableOpacity style={Styles.LineContainer} onPress={onPress}>
      <Icon
        name="arrow-left"
        size={22}
        color="#2974B4"
        style={{marginLeft: 23, marginRight: 6}}
      />
      <Text style={{color: '#000000', marginLeft: 5, fontWeight: "700", fontSize: 18}}>Voltar</Text>
    </TouchableOpacity>
  );
};

export default React.memo(BackButton)
