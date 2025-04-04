import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Styles from './Styles';

const AccordionMenu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={Styles.container}>
      <TouchableOpacity style={Styles.header} onPress={() => setIsOpen(!isOpen)}>
        <Text style={Styles.title}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View>{children}</View>}
    </View>
  );
};

export default AccordionMenu;
