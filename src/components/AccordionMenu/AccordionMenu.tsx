import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import Styles from './Styles';

const AccordionMenu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={Styles.container}>
      <Pressable style={({pressed}) => [Styles.header, {opacity : pressed ? 0.6 : 1}]} onPress={() => setIsOpen(!isOpen)}>
        <Text style={Styles.title}>{title}</Text>
      </Pressable>
      {isOpen && <View>{children}</View>}
    </View>
  );
};

export default AccordionMenu;
