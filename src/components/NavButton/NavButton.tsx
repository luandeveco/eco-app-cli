import React from 'react';
import {Pressable, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Styles} from './Style';

const NavButton = ({onPress}) => {
  return (
    <Pressable style={({pressed}) => [Styles.LineContainer, {opacity : pressed ? 0.6 : 1}]} onPress={onPress}>
      <Icon
        name="arrow-left"
        size={22}
        color="#2974B4"
        style={{marginLeft: 23, marginRight: 6}}
      />
      <Text style={{color: '#000000', marginLeft: 5, fontWeight: "700", fontSize: 18}}>Voltar</Text>
    </Pressable>
  );
};

export default React.memo(NavButton)
