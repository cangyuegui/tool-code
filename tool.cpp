struct PrintT
                {
                    void printBT(const std::string& prefix, LinkeNode* node, bool isFirst)
                    {
                        if( node != nullptr )
                        {
                            std::cout << prefix;

                            std::cout << (isFirst ? "├───" : "└───" );

                            // print the value of the node
                            std::cout << node->name().toStdString() << std::endl;

                            for (auto i = node->_children.begin(); i != node->_children.end(); ++i)
                            {
                                LinkeNode* cln = *i;
                                auto nextItr = i;
                                ++nextItr;
                                bool cisFirst = !(nextItr == node->_children.end());
                                printBT( prefix + (isFirst ? "│   " : "    "), cln, cisFirst);
                            }
                        }
                    }
                };


                PrintT pt;
                pt.printBT("", node, false);
