import React from 'react';
import { Text } from "react-native";
import { colors } from '../../../utils/constants';

const TextSimple = ({ style, text, id = '', idLabel = '' }) => {
    return (
        <Text
            testID={id}
            accessible={true}
            accessibilityLabel={idLabel}
            maxFontSizeMultiplier={1}
            style={{ color: colors.black, ...style }}>
            {text}
        </Text>
    )
};

export default TextSimple;
