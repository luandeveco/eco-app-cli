import React from "react";
import { Pressable, View, Text, Image } from "react-native";
import {Styles} from './Styles'

const BackButton = ({onPress}) => {
    return  (
        <Pressable style={({pressed}) => [Styles.container, {opacity : pressed ? 0.6 : 1}]}
            onPress={onPress}>
            <View style={Styles.button}>
                <Image
                source={require('../../assets/icons/voltar.png')}
                style={{maxWidth: 15, height: 15}}
                />
                <Text style={{color: '#2974B4', marginLeft: 5,fontWeight: '700',fontSize: 18,}}>
                    Voltar
                </Text>
            </View>
        </Pressable>
    )
}
export default React.memo(BackButton)